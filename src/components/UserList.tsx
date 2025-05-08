import React from 'react';
import { User, useChat } from '../context/ChatContext';
import { Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const UserList: React.FC = () => {
  const { users, currentUser } = useChat();

  return (
    <div className="bg-gray-100 dark:bg-gray-800 h-full p-4 flex flex-col">
      <div className="flex items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <Users className="mr-2 text-gray-700 dark:text-gray-300" size={20} />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Users</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {users.map((user) => (
            <UserItem 
              key={user.id} 
              user={user} 
              isCurrentUser={user.id === currentUser?.id}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const UserItem: React.FC<{ user: User; isCurrentUser: boolean }> = ({ user, isCurrentUser }) => {
  const lastSeen = user.lastSeen ? formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true }) : '';

  return (
    <li className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
      <div className="relative">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
          user.online ? 'bg-green-500' : 'bg-gray-400'
        }`}></div>
      </div>
      
      <div className="ml-2 flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
            {user.username}
            {isCurrentUser && <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(you)</span>}
          </p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user.online ? 'Online' : `Last seen ${lastSeen}`}
        </p>
      </div>
    </li>
  );
};

export default UserList;