<?php
return (object)[
  'title' => 'goose-app',
  'app_srl' => 1,
  'darkMode' => true,
  'responsive' => true,
  'description' => 'demos articles on goose-app',
  'header' => (object)[
    'logoPath' => '/user/img-logo.png',
    'navigation' => [
      (object)[
        'label' => 'Menu #1',
        'link' => '/nest/menu1/',
        'target' => '',
        'match' => '/nest/menu1',
      ],
      (object)[
        'label' => 'Menu #2',
        'link' => '/nest/menu2/',
        'target' => '',
        'match' => '/nest/menu2',
      ],
      (object)[
        'label' => 'Pages',
        'link' => null,
        'target' => '',
        'match' => '/page',
        'children' => [
          (object)[
            'label' => 'About',
            'link' => '/page/about/',
            'target' => '',
            'match' => '/page/about',
          ],
          (object)[
            'label' => 'Guide',
            'link' => '/page/guide/',
            'target' => '',
            'match' => '/page/guide',
          ],
        ],
      ],
    ],
  ],
  'footer' => (object)[
    'copyright' => 'Copyright 2020 goose. All right reserved.',
  ],
  'index' => (object)[
    'title' => 'Newest articles',
    'searchTitlePrefix' => 'Keyword:',
    'skin' => 'thumbnail', // card,thumbnail
    'size' => 24,
    'showMeta' => (object)[
      'nest' => true,
      'category' => true,
      'order' => true,
      'regdate' => false,
      'hit' => true,
      'like' => true,
    ],
  ],
  'article' => (object)[
    'showMeta' => (object)[
      'nest' => true,
      'category' => true,
      'regdate' => false,
      'order' => true,
      'hit' => true,
      'like' => true,
    ],
  ],
  'rss' => (object)[
    'size' => 15,
  ],
];
