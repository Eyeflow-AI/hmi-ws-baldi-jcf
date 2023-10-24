const IPV6toIPv4 = (ipv6) => {
  const ipv6Pattern = /::ffff:(\d+\.\d+\.\d+\.\d+)/;
  const ipv4Pattern = /(\d+\.\d+\.\d+\.\d+)/;

  const match = ipv6.match(ipv6Pattern);

  let ipv4Address = '';

  if (match && match.length >= 2) {
    ipv4Address = match[1];
    console.log("IPv4 address:", ipv4Address);
  } else {
    console.log("No IPv4 address found.");
  }
  if (ipv4Address === '') {
    const match = ipv6.match(ipv4Pattern);
    if (match && match.length >= 1) {
      ipv4Address = match[1];
      console.log("IPv4 address:", ipv4Address);
    } else {
      console.log("No IPv4 address found.");
    }
  }
  return ipv4Address;
}

export default IPV6toIPv4;