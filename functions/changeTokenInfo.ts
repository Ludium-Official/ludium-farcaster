export const changeTokenInfo = (address: string) => {
  if (address.indexOf("0xBE5Da172BbffffF5AEa27017745e71eA1907dad1") >= 0) {
    return {
      image:
        "https://github.com/juniahn-dev/twitter/blob/main/assets/BRETT-token.png?raw=true",
      denom: "BRETT",
      address,
    };
  } else if (
    address.indexOf("0xE4aB69C077896252FAFBD49EFD26B5D171A32410") >= 0
  ) {
    return {
      image:
        "https://github.com/juniahn-dev/twitter/blob/main/assets/TOSHI-token.png?raw=true",
      denom: "TOSHI",
      address,
    };
  } else {
    return {
      image:
        "https://github.com/juniahn-dev/twitter/blob/main/assets/INU-token.png?raw=true",
      denom: "BSHIB",
      address,
    };
  }
};

export const changeBg = (address: string, approve?: boolean) => {
  if (address.indexOf("0xBE5Da172BbffffF5AEa27017745e71eA1907dad1") >= 0) {
    return {
      background:
        "https://github.com/juniahn-dev/twitter/blob/main/assets/brett-bet-bg.png?raw=true",
      mainInfo: approve
        ? "https://github.com/juniahn-dev/twitter/blob/main/assets/approve-brett-token-info.png?raw=true"
        : "https://github.com/juniahn-dev/twitter/blob/main/assets/brett-token-info.png?raw=true",
    };
  } else {
    return {
      background: approve
        ? "https://github.com/juniahn-dev/twitter/blob/main/assets/approve-bg.png?raw=true"
        : "https://github.com/juniahn-dev/twitter/blob/main/assets/bet-bg.png?raw=true",
      mainInfo: null,
    };
  }
};
