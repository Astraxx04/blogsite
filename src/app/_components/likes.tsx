'use client';
import { useEffect, useState } from 'react';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
} from 'firebase/firestore';
import { db } from '../../lib/firebase-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp,
    faThumbsDown,
    faEye,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
    postKey: string;
    isValidPage: boolean;
};

const env = process.env.NEXT_PUBLIC_ENV || "dev";
const collectionName = env === "dev" ? "posts-dev" : "posts-prod";

export default function PostAnalytics({ postKey, isValidPage }: Props) {
    const [readCount, setReadCount] = useState<number>(0);
    const [likesCount, setLikesCount] = useState<number>(0);
    const [unlikesCount, setUnlikesCount] = useState<number>(0);
    const [userAction, setUserAction] = useState<'like' | 'unlike' | null>(
        null
    );
    const [userIpHash, setUserIpHash] = useState<string>('');

    useEffect(() => {
        initializeAnalytics();
    }, [postKey]);

    const initializeAnalytics = async () => {
        try {
            const ipAddress = await fetchIpAddress();
            const hashedIp = await hashIp(ipAddress);
            setUserIpHash(hashedIp);

            const postDocRef = doc(db, collectionName, postKey);
            const postDoc = await getDoc(postDocRef);

            if (postDoc.exists()) {
                const data = postDoc.data();

                setReadCount(data.readCount || 0);
                setLikesCount(data.likedBy?.length || 0);
                setUnlikesCount(data.unlikedBy?.length || 0);

                if (data.likedBy?.includes(hashedIp)) {
                    setUserAction('like');
                } else if (data.unlikedBy?.includes(hashedIp)) {
                    setUserAction('unlike');
                }

                if (isValidPage && !data.visitedBy?.includes(hashedIp)) {
                    await updateDoc(postDocRef, {
                        readCount: increment(1),
                        visitedBy: arrayUnion(hashedIp),
                    });
                    setReadCount((prev) => prev + 1);
                }
            } else {
                if (isValidPage) {
                    await setDoc(postDocRef, {
                        readCount: 1,
                        likedBy: [],
                        unlikedBy: [],
                        visitedBy: [hashedIp],
                    });
                    setReadCount(1);
                }
            }
            console.log('Read count: ', readCount);
        } catch (error) {
            console.error('Error initializing analytics: ', error);
        }
    };

    const fetchIpAddress = async (): Promise<string> => {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    };

    const hashIp = async (ip: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(ip);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    };

    const handleLike = async () => {
        try {
            const postDocRef = doc(db, collectionName, postKey);

            if (userAction === 'like') {
                await updateDoc(postDocRef, {
                    likedBy: arrayRemove(userIpHash),
                });
                setLikesCount((prev) => prev - 1);
                setUserAction(null);
            } else {
                await updateDoc(postDocRef, {
                    likedBy: arrayUnion(userIpHash),
                    unlikedBy: arrayRemove(userIpHash),
                });
                setLikesCount((prev) => prev + 1);
                if (userAction === 'unlike')
                    setUnlikesCount((prev) => prev - 1);
                setUserAction('like');
            }
        } catch (error) {
            console.error('Error handling like: ', error);
        }
    };

    const handleUnlike = async () => {
        try {
            const postDocRef = doc(db, collectionName, postKey);

            if (userAction === 'unlike') {
                await updateDoc(postDocRef, {
                    unlikedBy: arrayRemove(userIpHash),
                });
                setUnlikesCount((prev) => prev - 1);
                setUserAction(null);
            } else {
                await updateDoc(postDocRef, {
                    unlikedBy: arrayUnion(userIpHash),
                    likedBy: arrayRemove(userIpHash),
                });
                setUnlikesCount((prev) => prev + 1);
                if (userAction === 'like') setLikesCount((prev) => prev - 1);
                setUserAction('unlike');
            }
        } catch (error) {
            console.error('Error handling unlike: ', error);
        }
    };

    return (
        <div className="analytics-section flex items-center space-x-4">
            <div className="flex items-center">
                <FontAwesomeIcon icon={faEye} />
                <p className="pl-2 text-lg font-medium">{readCount}</p>
            </div>
            <div className="flex items-center space-x-4">
                <div
                    className={`cursor-pointer ${
                        userAction === 'like'
                            ? 'text-green-500'
                            : 'text-gray-600'
                    }`}
                    onClick={handleLike}
                >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span className="pl-2 text-lg font-medium">
                        {likesCount}
                    </span>
                </div>
                <div
                    className={`cursor-pointer ${
                        userAction === 'unlike'
                            ? 'text-red-500'
                            : 'text-gray-600'
                    }`}
                    onClick={handleUnlike}
                >
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <span className="pl-2 text-lg font-medium">
                        {unlikesCount}
                    </span>
                </div>
            </div>
        </div>
    );
}
