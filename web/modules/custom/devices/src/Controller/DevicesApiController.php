<?php

namespace Drupal\devices\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Controller\ControllerBase;

class DevicesApiController extends ControllerBase
{

  public function list(Request $request): JsonResponse
  {
    // $page  = max(0, (int) $request->query->get('page', 0));
    // $limit = 4;
    $limit = (int) $request->query->get('limit', 4);
    // $offset = $page * $limit;
    $offset = (int) $request->query->get('offset', 0);

    $connection = \Drupal::database();

    // данные
    $rows = $connection->select('devices', 'd')
      ->fields('d', ['id', 'name', 'created'])
      ->range($offset, $limit)
      ->execute()
      ->fetchAll();

    $total = $connection->select('devices', 'd')
      ->countQuery()
      ->execute()
      ->fetchField();

    $devices = array_map(fn($r) => [
      'id'      => $r->id,
      'name'    => $r->name,
      'created' => \Drupal::service('date.formatter')->format($r->created, 'short'),
    ], $rows);

    return new JsonResponse([
      'devices' => $devices,
      'total'   => (int) $total,
      'limit'   => $limit,
      'offset'    => $offset,
    ]);
  }
}
