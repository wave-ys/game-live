using System.Net.Mime;
using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace GameLiveServer.Events;

public class AppEventBus(IModel model) : IAppEventBus
{
    public void Publish<T>(IEventMessage<T> message)
    {
        model.ExchangeDeclare(message.ExchangeName, ExchangeType.Topic);

        var properties = model.CreateBasicProperties();
        properties.ContentType = MediaTypeNames.Application.Json;
        properties.DeliveryMode = (byte)(message.Persistent ? 2 : 1);
        var content = JsonSerializer.Serialize(message.MessageBody);
        model.BasicPublish(message.ExchangeName, message.RoutingKey, false,
            properties, Encoding.UTF8.GetBytes(content));
    }

    public string ConsumeAsync<T>(IEventConsumer<T> consumer)
    {
        model.ExchangeDeclare(consumer.ExchangeName, ExchangeType.Topic);
        var queueName = model.QueueDeclare().QueueName;
        model.QueueBind(queueName, consumer.ExchangeName, consumer.RoutingKey);

        var basicConsumer = new AsyncEventingBasicConsumer(model);
        basicConsumer.Received += async (_, args) =>
        {
            var body = JsonSerializer.Deserialize<T>(args.Body.ToArray());
            if (body == null)
                throw new Exception("Invalid event format");
            await consumer.Consumer(body);
            model.BasicAck(args.DeliveryTag, false);
        };

        return model.BasicConsume(queueName, false, basicConsumer);
    }
}