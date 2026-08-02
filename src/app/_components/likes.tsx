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
    /** 'compact' shows the read count only — used on post cards. */
    variant?: 'compact' | 'full';
};

const env = process.env.NEXT_PUBLIC_ENV || 'dev';
const collectionName = env === 'dev' ? 'posts-dev' : 'posts-prod';

export default function PostAnalytics({
    postKey,
    isValidPage,
    variant = 'full',
}: Props) {
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

    /* Cards only need the view count — voting belongs on the post itself. */
    if (variant === 'compact') {
        return (
            <span className="inline-flex items-center gap-1.5 text-sm text-fg-subtle">
                <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" />
                {readCount}
            </span>
        );
    }

    const chip =
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors';

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm text-fg-subtle">
                <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                {readCount} {readCount === 1 ? 'read' : 'reads'}
            </span>

            <span className="h-4 w-px bg-line" aria-hidden />

            <button
                onClick={handleLike}
                aria-pressed={userAction === 'like'}
                aria-label={`Helpful. ${likesCount} so far.`}
                className={`${chip} ${
                    userAction === 'like'
                        ? 'border-brand-pink bg-brand-pink/10 text-accent'
                        : 'border-line bg-card text-fg-muted hover:border-brand-rose hover:text-fg'
                }`}
            >
                <FontAwesomeIcon icon={faThumbsUp} className="h-4 w-4" />
                {likesCount}
            </button>

            <button
                onClick={handleUnlike}
                aria-pressed={userAction === 'unlike'}
                aria-label={`Not helpful. ${unlikesCount} so far.`}
                className={`${chip} ${
                    userAction === 'unlike'
                        ? 'border-brand-purple bg-brand-purple/10 text-brand-purple-light'
                        : 'border-line bg-card text-fg-muted hover:border-brand-purple-light hover:text-fg'
                }`}
            >
                <FontAwesomeIcon icon={faThumbsDown} className="h-4 w-4" />
                {unlikesCount}
            </button>
        </div>
    );
}
