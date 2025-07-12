interface IFileOption {
    /**
     * Represents a file option with a name and path.
     * @property {string} name - The name of the file (without extension).
     * @property {string} path - The path to the file.
     */
  name: string;
  path: string;
}

class FileLoader {
  private dropdownEl: HTMLSelectElement | undefined;
  private scriptEl: HTMLScriptElement | null = null;
  private files: IFileOption[] = [];


  constructor() {
    this.setupUI();
    this.loadAvailableFiles().then(_r => {});
  }

  private async loadAvailableFiles() {
    try {
      // In a real environment, you'd need a server-side solution to get all files
      // For Vite, we can use its import.meta.glob feature
      // @ts-ignore
      const modules = import.meta.glob('./*.ts', { eager: false });

      // Convert the modules object to our IFileOption array
      this.files = Object.keys(modules).map(path => {
        // Extract just the filename from the path
        const name = path.split('/').pop()?.replace('.ts', '') || '';
        return { name, path };
      });

      // Don't include the current file_loader.ts
      this.files = this.files.filter(file => file.name !== 'file_loader');

      // Sort the files alphabetically
      this.files.sort((a, b) => a.name.localeCompare(b.name));

      // Populate the dropdown
      this.populateDropdown();
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }

  private populateDropdown() {
    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a file';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    this.dropdownEl?.appendChild(defaultOption);

    // Add all the file options
    this.files.forEach(file => {
      const option = document.createElement('option');
      option.value = file.path;
      option.textContent = file.name;
      this.dropdownEl?.appendChild(option);
    });
  }

  private setupUI() {
    // Create container
    const container = document.createElement('div');
    container.style.margin = '20px';
    container.style.fontFamily = 'Arial, sans-serif';

    // Create label
    const label = document.createElement('label');
    label.textContent = 'Select TypeScript file to load: ';
    label.style.marginRight = '10px';

    // Create select dropdown
    this.dropdownEl = document.createElement('select');
    this.dropdownEl.style.padding = '5px';
    this.dropdownEl.style.borderRadius = '4px';

    // Add change event listener
    this.dropdownEl.addEventListener('change', this.handleFileChange.bind(this));

    // Append elements
    container.appendChild(label);
    container.appendChild(this.dropdownEl);

    // Add to page
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.insertBefore(container, appElement.firstChild);
    } else {
      document.body.appendChild(container);
    }
  }

  private handleFileChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedPath = select.value;

    if (selectedPath) {
      this.loadScript(selectedPath).then(_r => {});
    }
  }

  private async loadScript(path: string) {
    try {
      // Clean up any previously loaded script
      if (this.scriptEl && this.scriptEl.parentNode) {
        this.scriptEl.parentNode.removeChild(this.scriptEl);
      }

      // Clear the app div (except our UI)
      const appEl = document.getElementById('app');
      if (appEl) {
        // Keep only our container div
        const children = Array.from(appEl.children);
        for (let i = 1; i < children.length; i++) {
          appEl.removeChild(children[i]);
        }
      }

      // Dynamic import the selected module
      await import(/* @vite-ignore */ path)
      console.log(`Loaded module: ${path}`);
    } catch (error) {
      console.error('Error loading script:', error);
    }
  }
}

// Initialize the file loader
const fileLoader = new FileLoader();

export default fileLoader;
