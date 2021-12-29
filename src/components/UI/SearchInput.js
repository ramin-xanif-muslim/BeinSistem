import React, { useState } from "react";

// function SearchInput(props) {
//     const [searchTerm, setSearchTerm] = useState('')
//     const onClick = () => {
//         props.fetchSearchTerm(searchTerm)
//     }
//     return (
//         <div>
//             <input autoFocus  {...props} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             <button onClick={onClick}>search</button>
//         </div>
//     )
// }

// export default SearchInput

function SearchInput({ searchTerm, setSearchTerm, searchFunc }) {
	const onClick = () => {
		searchFunc(searchTerm);
	};

	return (
		<div>
			<input
				onPressEnter={onClick}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<button onClick={onClick}>search</button>
		</div>
	);
}

export default SearchInput;
