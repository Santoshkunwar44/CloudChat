export const getSender = (loggedUser, user) => {
  if (user) {
    const nextuser = user.filter((e) => e?._id !== loggedUser?._id);
    const nextuserName = nextuser[0]?.userName;
    return nextuserName;
  }
};
export const getSenderFull = (loggedUser, user) => {
  if (user) {
    const nextuser = user.filter((e) => e?._id !== loggedUser?._id);
    const nextuserName = nextuser[0];
    return nextuserName;
  }
};
export const getSenderId = (loggedUser, user) => {
  if (user) {
    const nextuser = user.filter((e) => e?._id !== loggedUser?._id);
    const nextUserId = nextuser[0]?._id;
    return nextUserId;
  }
};
