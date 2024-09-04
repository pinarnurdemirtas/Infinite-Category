import { useMemo, useState } from "react";
import CategorySelect from "./category-select";

function App() {
  const [parent, setParent] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([
    { id: 1, name: "A", parent: 0 },
    { id: 2, name: "B", parent: 0 },
    { id: 3, name: "C", parent: 0 },
    { id: 4, name: "B-1", parent: 2 },
    { id: 5, name: "B-2", parent: 2 },
    { id: 6, name: "B-3", parent: 2 },
    { id: 7, name: "B-2-1", parent: 5 },
    { id: 8, name: "B-2-2", parent: 5 },
    { id: 9, name: "B-2-2 sub-1", parent: 8 },
    { id: 10, name: "B-2-2 sub-1 / 2", parent: 9 },
  ]);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.parent === parent),
    [parent, categories]
  );

  const findCategories = (parent) => {
    if (parent === 0) {
      return [];
    }
    const category = categories.find((c) => c.id === parent);
    if (category) {
      return [
        category,
        category.parent !== 0 && findCategories(category.parent),
      ];
    }
  };
  
  const getBreadcrumb = (parent) => {
    return findCategories(parent).flat(Infinity).filter(Boolean).reverse();
  };

  const breadcrumb = useMemo(() => getBreadcrumb(parent), [parent]);

  const submitHandle = (e) => {
    e.preventDefault();
    setCategories([
      ...categories,
      {
        id: categories.length + 1,
        name: categoryName,
        parent,
      },
    ]);
    setCategoryName("");
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const subCategoryHandle = (category) => {
    setParent(category.id);
  };

  const getSubCategoryCount = (id) => {
    return (categories && categories.filter((c) => c.parent === id).length) || 0;
  };

  return (
    <div className="container mx-auto py-8">
		
      <form className="flex gap-x-4 mb-6" onSubmit={submitHandle}>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="flex-1 border border-gray-300 outline-none focus:ring focus:ring-indigo-400 h-12 px-4 rounded-lg shadow-sm text-lg"
          placeholder="Enter Category Name"
        />
        <button
          disabled={!categoryName}
          type="submit"
          className="h-12 px-6 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>
      {breadcrumb.length > 0 && (
        <nav className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg mb-6 flex items-center gap-x-4 text-base">
          {breadcrumb.map((c, index) => (
            <button
              key={index}
              onClick={() => setParent(c.parent)}
              className="text-indigo-600 hover:underline"
            >
              {c.name}
            </button>
          ))}
        </nav>
      )}
      <div className="grid gap-y-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-md flex items-center justify-between text-lg"
          >
            <span className="font-medium text-gray-700">{category.name}</span>
            <nav className="flex items-center gap-x-2">
              <button
                onClick={() => subCategoryHandle(category)}
                className="h-10 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Subcategories ({getSubCategoryCount(category.id)})
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className="h-10 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </nav>
          </div>
        ))}
      </div>
      <CategorySelect categories={categories} />
    </div>
  );
}

export default App;
