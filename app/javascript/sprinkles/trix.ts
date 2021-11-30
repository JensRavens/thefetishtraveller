import Trix from 'trix';

Trix.config.blockAttributes.aside = {
  tagName: 'aside',
};

Trix.config.blockAttributes.heading1.tagName = 'h2';

addEventListener('trix-initialize', (event) => {
  const buttonHTML =
    '<button type="button" class="trix-button" data-trix-attribute="aside" title="Aside Image">AS</button>';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupElement = (event.target as any).toolbarElement.querySelector(
    '.trix-button-group--block-tools'
  );
  groupElement.insertAdjacentHTML('beforeend', buttonHTML);
});
