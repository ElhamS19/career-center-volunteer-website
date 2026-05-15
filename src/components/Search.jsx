import Icon from "./Icon";
import styles from "../styles";
import { useState, useRef, useEffect } from "react"; 

export default function Search({}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchRef = useRef(null);

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
            ...styles.searchWrapper,
            width: searchOpen ? "220px" : "40px",
          }}
        >

         <div style={styles.navIcons}>
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
        </div>
      </div>
    );
}
