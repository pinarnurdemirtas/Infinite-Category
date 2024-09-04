import { useEffect, useRef, useState } from "react";

export default function CategorySelect({ categories }) {
	const [selected, setSelected] = useState([]);
	const [parents, setParents] = useState([]);
	const [parent, setParent] = useState(0);
	const filteredCategories = (parent) => categories.filter((c) => c.parent === parent);

	const getFilteredCategories = filteredCategories(parent);

	const ref = useRef();

	useEffect(() => {
		ref.current.scrollTo({
			left: ref.current.scrollLeft + 450,
			behavior: "smooth",
		});
	}, [selected]);

	return (
		<div className="flex gap-x-6 overflow-x-auto mt-6 pb-4" ref={ref}>
			{parents.length > 0 &&
				parents.map((parent, key) => {
					const categories = filteredCategories(parent);
					return (
						<div
							key={key}
							className="w-96 flex flex-col border border-gray-300 rounded-lg p-6 flex-shrink-0 bg-white shadow-md"
						>
							{categories.map((c) => (
								<button
									key={c.id}
									onClick={() => {
										setParent(c.id);
										setSelected([...selected.slice(0, key), c.id]);
										setParents([...parents.slice(0, key), c.parent]);
									}}
									className={`h-10 px-4 rounded text-left text-base mb-2 ${
										selected.includes(c.id)
											? "bg-indigo-500 text-white"
											: "hover:bg-gray-100"
									} transition duration-300 ease-in-out transform hover:scale-105`}
								>
									{c.name}
								</button>
							))}
						</div>
					);
				})}
			{getFilteredCategories.length > 0 ? (
				<div className="w-96 flex flex-col border border-gray-300 rounded-lg p-6 flex-shrink-0 bg-white shadow-md">
					{getFilteredCategories.map((c) => (
						<button
							key={c.id}
							onClick={() => {
								setParent(c.id);
								setSelected([...selected, c.id]);
								setParents([...parents, c.parent]);
							}}
							className="h-10 px-4 rounded text-left hover:bg-gray-100 text-base mb-2 transition duration-300 ease-in-out transform hover:scale-105"
						>
							{c.name}
						</button>
					))}
				</div>
			) : (
				<div className="bg-green-500 text-white text-base p-5 rounded-lg flex flex-col items-center justify-center shadow-md">
					<div>Kategori seçimi tamamlandı!</div>
					<button className="h-10 bg-white text-green-700 px-6 rounded-md mt-4 transition duration-300 ease-in-out transform hover:bg-green-600 hover:text-white">
						Devam Et
					</button>
				</div>
			)}
		</div>
	);
}
