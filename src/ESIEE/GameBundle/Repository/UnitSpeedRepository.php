<?php

namespace ESIEE\GameBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;


class UnitSpeedRepository  extends EntityRepository
{
    public function findAllSimple()
    {
        $data = $this->createQueryBuilder('s')
            ->select('g.id, g.name, g.protection, s.cost, u.name unit')
            ->join('s.ground', 'g')
            ->join('s.unitType', 'u')
            ->getQuery()->getResult(Query::HYDRATE_ARRAY);

        $compact = array();

        foreach($data as $speed){
            if(array_key_exists($speed['id'], $compact)){
                $compact[$speed['id']]['moveFactor'][$speed['unit']] = $speed['cost'];
            }else{
                $compact[$speed['id']] = array(
                    'id' => $speed['id'],
                    'name' => $speed['name'],
                    'protection' => $speed['protection'],
                    'moveFactor' => array(
                        $speed['unit'] => $speed['cost'],
                    ),
                );
            }
        }

        return $compact;
    }
} 