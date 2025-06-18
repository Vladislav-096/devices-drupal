<?php

namespace Drupal\devices\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Form\FormBuilderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class DevicesPageController extends ControllerBase
{
  public function content(): array
  {
    return [
      '#markup'   => '<div id="react-root"></div>',
      '#attached' => [
        'library' => ['devices/devices-react'],
      ],
    ];
  }
}
