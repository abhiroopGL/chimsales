const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      autoComplete="off"
    />
  );
};

export default SearchBar;
