namespace GameLiveServer.Events;

public interface IEventConsumer<in T>
{
    public string ExchangeName { get; }
    public string RoutingKey { get; }
    public Func<T, Task> Consumer { get; }
}