import React from 'react'

export default function EditRow(props) {
    const [newTitle,setNewTitle] = React.useState(props.post.title);

    function handleClick(){
        if(newTitle){
            props.edit(props.post.id, newTitle)
        }
    }

    return (
        <div className='edit--row'>
            <input className='edit'
                type="text"
                onChange={(e) => setNewTitle(e.target.value) }
                placeholder=''
                name="title"
                value={newTitle}
            >
            </input>
            <button className='save-btn'
             onClick={handleClick}
            >
                Save
            </button>
        </div>
    )
}
