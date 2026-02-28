import { useAuthStore } from "../store/useAuthStore";

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <p className="text-gray-600 text-lg">
          Please login to view profile
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="max-w-md border rounded-lg p-4 bg-white shadow-sm">
        <div className="space-y-2 text-gray-800">
          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Status:</span> Logged In
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

