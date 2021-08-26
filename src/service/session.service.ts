import { FilterQuery, LeanDocument, UpdateQuery } from "mongoose";
import Session, { SessionDocument } from "../model/session.model";
import { UserDocument } from "../model/user.model";
import config from "config";
import { sign, decode } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "../service/user.service";
export async function createSession(userId: string, userAgent: string) {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
}

export function createAccessToken({
  user,
  session,
}: {
  user:
    | Omit<UserDocument, "password">
    | LeanDocument<Omit<UserDocument, "password">>;
  session:
    | Omit<SessionDocument, "password">
    | LeanDocument<Omit<SessionDocument, "password">>;
}) {
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") }
  );

  return accessToken;
}

export async function refIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = decode(refreshToken);

  if (!decode || !get(decoded, "_id")) return false;

  //Get the session
  const session = await Session.findById(get(decoded, "_id"));

  //Make sure the session still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session._id });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });
  return accessToken;
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return Session.updateOne(query, update);
}

export async function findSessions(
  query: FilterQuery<SessionDocument>
): Promise<SessionDocument> {
  return Session.find(query).lean();
}
