<?php

namespace Drupal\devices\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Form\FormBuilderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class DevicesPageController extends ControllerBase
{
  public function content()
  {
    $header = [
      'name' => $this->t('Name'),
      'created' => $this->t('Created'),
    ];

    // Формирую запрос в БД
    $query = \Drupal::database()->select('devices', 'd')
      ->extend('Drupal\Core\Database\Query\PagerSelectExtender') // добавляет поддержку пагинации (В БД? Не понял)
      ->fields('d', ['name', 'created']) // Работает, не понял почему подсвечивает
      ->limit(4);

    // Выполнение sql запроса
    $results = $query->execute();

    $rows = [];
    // $results = \Drupal::database()->select('devices', 'd')
    //   ->fields('d', ['name', 'created'])
    //   ->execute();

    foreach ($results as $record) {
      $rows[] = [
        'name' => $record->name,
        // 'created' => $record->created,
        'created' => \Drupal::service('date.formatter')->format($record->created, 'short'), // Форматирование даты
      ];
    }

    $build['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#empty' => $this->t('No entries found.'),
    ];

    // Добавляю новый элемент в $build
    $build['pager'] = [
      '#type' => 'pager',
    ];

    return $build;
  }
}
