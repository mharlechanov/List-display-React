
import React, { useState, useEffect } from 'react'
import ListItem from './ListItem'


export default function List() {

    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1);
    const [postsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            const storageItems = localStorage.getItem("items_key")
            if (storageItems) {
                setPosts(JSON.parse(storageItems))
            } else {
                fetch("https://storage.googleapis.com/aller-structure-task/article_list.json")
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        const maping = data.map((item, index) => ({ ...item, id: index + 1 }))
                        localStorage.setItem("items_key", JSON.stringify(maping))
                        setPosts(maping);
                    })
            }
        }

        fetchData()
    }, [])

    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const visiblePosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const items = visiblePosts.map((post) => {
        return (
            <ListItem
                key={post.id}
                post={post}
                deletePost={deletePost}
                editPost={editPost} />
        )

    })

    function handleNext() {
        setPage(prevPage => {
            const nextPage = prevPage + 1
            if (nextPage * postsPerPage - postsPerPage > Math.ceil(posts.length)) {
                return prevPage;
            }
            return nextPage;
        })
    }

    function handlePrev() {
        setPage(prevPage => {
            const nextPage = prevPage - 1
            if (nextPage < 1) {
                return prevPage;
            }
            return nextPage;
        })
    }

    function deletePost(event, postId) {
        event.stopPropagation()
        setPosts(prevPost => {

            let result = prevPost.filter(post => post.id !== postId)
            localStorage.setItem("items_key", JSON.stringify(result))
            return result;
        }

        )
    }

    function editPost(postId, newTitle) {
        setPosts(prevPost => {
            const newArray = []
            for (let i = 0; i < prevPost.length; i++) {
                const currentEditPost = prevPost[i]
                if (currentEditPost.id === postId) {
                    //newArray.splice(currentEditPost.id, 0, { ...currentEditPost, title: newTitle })
                    /// newArray.unshift({ ...currentEditPost, title: newTitle })
                    newArray.push({ ...currentEditPost, title: newTitle })
                } else {
                    newArray.push(currentEditPost)
                }
            }
            localStorage.setItem("items_key", JSON.stringify(newArray))
            return newArray
        })
    }


    return (
        <>
            <div className='title'>Articles</div>
            <div className='list-container'>{items}</div>
            <div className='nav'>
                <svg onClick={handlePrev} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="arrows prev">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <svg onClick={handleNext} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="arrows next">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>

            </div>
            
        </>
    )
}
