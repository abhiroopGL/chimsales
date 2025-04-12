const UserCard = ({ user }) => (
    <div className="p-4 border border-black rounded-xl">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm">{user.email}</p>
    </div>
);

export default UserCard;
