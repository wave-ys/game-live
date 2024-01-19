using GameLiveServer.Configuration;

namespace GameLiveServer.Protocols;

public class StreamProtocols
{
    private readonly Dictionary<string, IStreamProtocol> _protocols = new();

    public StreamProtocols(AppStreamServerConfiguration configuration)
    {
        AddProtocol(new RtmpProtocol(configuration));
    }

    public IStreamProtocol? this[string protocol] => GetFromProtocolName(protocol);

    public IStreamProtocol? GetFromProtocolName(string protocol)
    {
        return _protocols.GetValueOrDefault(protocol);
    }

    public IStreamProtocol? GetFromSourceType(string sourceType)
    {
        var list = _protocols.Where(p => p.Value.SourceType == sourceType).ToList();
        return list.Count == 1 ? list.First().Value : null;
    }

    private void AddProtocol(IStreamProtocol protocol)
    {
        _protocols.Add(protocol.ProtocolName, protocol);
    }
}