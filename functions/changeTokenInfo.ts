export const changeTokenInfo = (address: string) => {
  if (address.indexOf("0xb1E8b5F91938868CB0E1d50958D56e2497827f2A") >= 0) {
    return {
      image:
        "https://github.com/juniahn-dev/twitter/blob/main/assets/BRETT-token.png?raw=true",
      denom: "BRETT",
      address,
    };
  } else if (
    address.indexOf("0x36e23aCAa237fdD90180Fe6B7d2630e53DB61924") >= 0
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
  if (address.indexOf("0xb1E8b5F91938868CB0E1d50958D56e2497827f2A") >= 0) {
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
