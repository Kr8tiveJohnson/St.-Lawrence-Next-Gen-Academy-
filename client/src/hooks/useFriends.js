import { useState, useEffect } from 'react';
import client from '../api/client';

export function useFriends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/friends'),
      client.get('/friends/requests')
    ]).then(([friendsRes, requestsRes]) => {
      setFriends(friendsRes.data.friends || []);
      setRequests(requestsRes.data.requests || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const sendRequest = (userId) => client.post('/friends/request', { userId });
  const acceptRequest = (friendshipId) => client.post(`/friends/accept/${friendshipId}`);
  const removeFriend = (userId) => client.delete(`/friends/${userId}`);

  return { friends, requests, loading, sendRequest, acceptRequest, removeFriend };
}
