export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
export default function getLikeTypes() {
  return {
    LIKE_COMMENT: "LIKE_COMMENT",
    LIKE_USERPOST: "LIKE_USERPOST",
    LIKE_REPLY: "LIKE_REPLY",
    LIKE_PICTURE: "LIKE_PICTURE",
    FRIEND_REQUEST: "FRIEND_REQUEST",
  };
}
export function checkNotificationType(type: string): string {
  let body = "";
  const types = getLikeTypes();
  switch (type) {
    case types.LIKE_USERPOST:
      body = " liked your Post";
      break;
    case types.LIKE_COMMENT:
      body = " liked your Comment";
      break;
    case types.LIKE_REPLY:
      body = " liked your Reply";
      break;
    case types.LIKE_PICTURE:
      body = " liked your Picture";
      break;
    case types.FRIEND_REQUEST:
      body = " wants to be your friend";
      break;
  }
  return body;
}
