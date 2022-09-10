function isQuarter(cron: string[]) {
  const cronMonth = cron[4];
  if (cronMonth === "1,4,7,10" || cronMonth === "2,5,8,11" || cronMonth === "3,6,9,12") {
    return true;
  } else {
    return false;
  }
}
function isMonth(cron: string[]) {
  const cronMonth = cron[4];
  const cronDay = cron[3];
  if (cronDay !== "*" && cronMonth === "*") {
    return true;
  } else {
    return false;
  }
}
function isWeek(cron: string[]) {
  const cronDay = cron[3];
  if (cronDay === "?") {
    return true;
  } else {
    return false;
  }
}
function isDay(cron: string[]) {
  const cronMonth = cron[4];
  const cronDay = cron[3];
  if (cronMonth === "*" && cronDay === "*") {
    return true;
  } else {
    return false;
  }
}
export function getFreq(cron: string) {
  const cronList = cron.trim().split(" ");
  if (cronList.length !== 6 && cronList.length !== 7) {
    throw new Error("cron 非法");
  } else {
    if (isQuarter(cronList)) {
      return "每季";
    } else if (isWeek(cronList)) {
      return "每周";
    } else if (isDay(cronList)) {
      return "每天";
    } else if (isMonth(cronList)) {
      return "每月";
    } else {
      return "其他";
    }
  }
}

export function getFreqConst(cron: string) {
  switch (getFreq(cron)) {
    case "每季":
      return "QUARTER";
    case "每周":
      return "WEEK";
    case "每天":
      return "DAY";
    case "每月":
      return "MONTH";
    default:
      return "";
  }
}
