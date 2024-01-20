namespace GameLiveServer.Events;

public class LiveStatusEventMessage(Guid userId, bool live) : IEventMessage<LiveStatusMessageBody>
{
    public string ExchangeName => AppExchangeNames.LiveStatus;

    public string RoutingKey => userId.ToString();

    public bool Persistent => false;

    public LiveStatusMessageBody MessageBody => new()
    {
        UserId = userId,
        Live = live
    };
}

public class LiveStatusMessageBody
{
    public Guid UserId { get; set; }
    public bool Live { get; set; }
}