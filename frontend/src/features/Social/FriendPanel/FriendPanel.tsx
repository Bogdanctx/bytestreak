import {
    useEffect,
    useState
} from 'react';
import { type IAccount } from '../../../entities';
import { api } from '../../../api';


function FriendPanel({ friendId }: { friendId: number }) {
    const [friend, setFriend] = useState<IAccount | null>(null);

    const fetchFriend = async () => {
        api.get(`/accounts/get?accountId=${friendId}`)
            .then(response => {
                if (response.status === 200) {
                    setFriend(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching friend details:', error);
            });
    };

    useEffect(() => {
        fetchFriend();
    }, [friendId]);

    if (!friend) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{friend.username}</h2>
            {/* Display other friend details here */}
        </div>
    );
}

export default FriendPanel;