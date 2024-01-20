namespace GameLiveServer.Events;

public class LiveStatusEventConsumer(Guid userId, Func<LiveStatusMessageBody, Task> consumer)
    : IEventConsumer<LiveStatusMessageBody>
{
    public string ExchangeName => AppExchangeNames.LiveStatus;
    public string RoutingKey => userId.ToString();

    public Func<LiveStatusMessageBody, Task> Consumer => consumer;
}