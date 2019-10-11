import admin from "firebase-admin";

import { {{modelName}} } from "../../models/{{modelName}}";

export default function(
  db: admin.firestore.Firestore
): Partial<{{modelName}}> {
  return {{data}};
}
