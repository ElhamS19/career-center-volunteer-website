import Icon from "./Icon";
import styles from "../styles";
import { useState, useRef, useEffect } from "react";

export default function Search({ onEventsClick }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchRef = useRef(null);

  // Example searchable data
  const items = [
    "Employer on Campus",
    "Here to Career",
    "Resume Workshop",
    "Mock Interview",
    "Job Fair",
    "Networking Event",
    "Alumni Panel",
  ];

  // Filter results
  const filteredResults = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchRef}
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          ...styles.searchWrapper,
          width: searchOpen ? "220px" : "40px",
        }}
      >
        {searchOpen && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            style={styles.searchInput}
          />
        )}

        <button
          style={styles.iconBtn}
          type="button"
          aria-label="Search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Icon name="search" />
        </button>
      </div>

      {/* SEARCH RESULTS */}
      {searchOpen && search.length > 0 && (
        <div style={styles.searchResults}>
          {filteredResults.length > 0 ? (
            filteredResults.map((result, index) => (
              <div
                key={index}
                style={styles.searchResultItem}
                onClick={() => {
                  setSearch(result);
                  setSearchOpen(false);

                  onEventsClick?.();
                }}
              >
                {result}
              </div>
            ))
          ) : (
            <div style={styles.searchNoResults}>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}