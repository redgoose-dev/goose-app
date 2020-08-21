<?php
return (object)[
  'title' => 'goose-app',
  'app_srl' => 3,
  'darkMode' => false,
  'responsive' => true,
  'description' => 'demos articles on goose-app',
  'header' => (object)[
    'logoPath' => '/assets/images/img-logo.png',
    'navigation' => [
      (object)[
        'label' => 'Visual',
        'link' => '/nest/scrap-visual/',
        'target' => '',
        'match' => '/nest/scrap-visual',
      ],
      (object)[
        'label' => 'Fashion',
        'link' => '/nest/scrap-fashion/',
        'target' => '',
        'match' => '/nest/scrap-fashion',
      ],
      (object)[
        'label' => 'Review',
        'link' => '/nest/scrap-review/',
        'target' => '',
        'match' => '/nest/scrap-review',
      ],
      (object)[
        'label' => 'Note',
        'link' => '/nest/scrap-note/',
        'target' => '',
        'match' => '/nest/scrap-note',
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
      'hit' => false,
      'like' => false,
    ],
  ],
  'article' => (object)[
    'showMeta' => (object)[
      'nest' => true,
      'category' => true,
      'regdate' => false,
      'order' => true,
      'hit' => true,
      'like' => false,
    ],
  ],
  'rss' => (object)[
    'size' => 15,
  ],
];
