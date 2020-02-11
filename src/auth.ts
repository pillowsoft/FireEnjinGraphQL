import * as admin from "firebase-admin";

export default async function auth(options, roles) {
  if (options.context.env === "local") {
    return true;
  }
  if (!options.context.token) {
    return false;
  }

  // const UserImport = await import("./models/User");
  // const User = new UserImport.UserModel();
  const decodedToken = await admin.auth().verifyIdToken(options.context.token);
  // const authUser = await User.find(decodedToken.uid);

  // await admin.auth().setCustomUserClaims(decodedToken.uid, {
  //   role: "admin"
  // });
  const user = await admin.auth().getUser(decodedToken.uid);

  const canAccessData =
    roles && roles.length > 0
      ? user && user.customClaims && user.customClaims["role"]
        ? roles.indexOf(user.customClaims["role"]) >= 0
        : false
      : true;

  return canAccessData;
}
