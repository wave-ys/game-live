using GameLiveServer.Configuration;

namespace GameLiveServer.Protocols;

public class StreamProtocols
{
    private readonly Dictionary<string, IStreamProtocol> _protocols = new();

    public StreamProtocols(AppStreamServerConfiguration configuration)
    {
        AddProtocol(new RtmpProtocol(configuration));
    }

    public IStreamProtocol? this[string protocol] => _protocols.GetValueOrDefault(protocol);

    private void AddProtocol(IStreamProtocol protocol)
    {
        _protocols.Add(protocol.ProtocolName, protocol);
    }
}