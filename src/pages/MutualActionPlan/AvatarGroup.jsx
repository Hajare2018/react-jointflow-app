import { Avatar } from '../../component-lib/catalyst/avatar';

export default function AvatarGroup({ users, size = 6 }) {
  return (
    <div className="isolate flex -space-x-1 overflow-hidden">
      {users.map((user, index, arr) => (
        <Avatar
          key={user.id}
          src={user.avatar}
          initials={`${user.first_name[0]}${user.last_name[0]}`}
          className={`size-${size} relative z-${(arr.length - index) * 10} inline-block rounded-full ring-2 ring-white dark:ring-zinc-900`}
        />
      ))}
    </div>
  );
}
