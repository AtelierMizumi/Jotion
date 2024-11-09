import { useOthers, useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";
import styles from "./Avatars.module.css";

// default Avatar if Name and Picture are not provided
const userDefault = {
  id: "Anonymous",
  info: {
    name: "Anonymous",
    color: "#D583F0",
    picture: "https://liveblocks.io/avatars/avatar-1.png",
  },
};

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className={styles.avatars}>
      {users.map(({ connectionId, info }) => {
        return (
          <Avatar key={connectionId} picture={info.picture} name={info.name} />
        );
      })}

      {currentUser && (
        <div className="relative ml-8 first:ml-0">
          <Avatar
            picture={currentUser.info.picture}
            name={currentUser.info.name}
          />
        </div>
      )}
    </div>
  );
}

export function Avatar({ picture, name }: { picture: string; name: string }) {
  return (
    <div className={styles.avatar} data-tooltip={name}>
      <Image
        src={picture}
        alt={name}
        className={styles.avatar_picture}
        data-tooltip={name}
      />
    </div>
  );
}
