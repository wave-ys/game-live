namespace GameLiveServer.Events;

public interface IEventMessage<T>
{
    public string ExchangeName { get; }
    public bool Persistent { get; }
    public string RoutingKey { get; }
    public T MessageBody { get; }
}