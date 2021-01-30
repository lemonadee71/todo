import Component from '../component.js';

const Header = () => {
  const showSidebar = (e) => {
    e.target.classList.toggle('is-active');

    let projects = document.getElementById('projects');
    projects.classList.toggle('show');
  };

  return Component.parseString`
  <header>
    <ul>
      <li>
        <button ${{
          onClick: showSidebar,
        }}class="hamburger hamburger--slider-r" type="button">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
      </li>
      <li><h1>ToDo</h1></li>
    </ul>
    <input
      type="text"
      name="search"
      class="dark"
      id="search-bar"
      placeholder="Search your tasks"
    />
  </header>
  `;
};

export default Header;
