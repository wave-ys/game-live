namespace GameLiveServer.Events;

public interface IAppEventBus
{
    public void Publish<T>(IEventMessage<T> message);

    // Return the consumer tag identifying the subscription when it has to be cancelled
    public string ConsumeAsync<T>(IEventConsumer<T> consumer);
}