using RabbitMQ.Client;

namespace GameLiveServer.Events;

public static class ServiceCollectionExtensions
{
    public static void AddAppEventBus(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddSingleton(
                new ConnectionFactory
                {
                    Uri = new Uri(configuration.GetConnectionString("MessageQueue") ??
                                  throw new InvalidOperationException("Message Queue Connection String not found")),
                    DispatchConsumersAsync = true
                }.CreateConnection()
            )
            .AddScoped(provider => provider.GetRequiredService<IConnection>().CreateModel())
            .AddScoped<IAppEventBus, AppEventBus>();
    }
}