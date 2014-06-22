<?php

namespace ESIEE\GameBundle\Twig;

use Doctrine\ORM\EntityManager;

class GameDataExtension extends \Twig_Extension
{
    /**
     * @var EntityManager
     */
    private $em;

    function __construct($em)
    {
        $this->em = $em;
    }

    public function getFunctions()
    {
        return array(
            'printGameData' => new \Twig_Function_Method($this, 'getGameData', array("is_safe" => array("html"))),
        );
    }

    public function getGameData()
    {
        $data = array(
            'buildings' => $this->em->getRepository('ESIEEGameBundle:Building')->findAll(),
            'tileFamilySimple' => $this->em->getRepository('ESIEEGameBundle:TileFamily')->findAllSimple(),
            'tilesSimple' => $this->em->getRepository('ESIEEGameBundle:Tile')->findAllSimple(),
        );

        return
            '<script type="text/javascript">'.
                'var tileFamily = ' . json_encode($data['tileFamilySimple']) . ';'.
                'var tiles = ' . json_encode($data['tilesSimple']) . ';'.
                'var buildings = ' . json_encode($data['buildings']) . ';'.
            '</script>';
    }

    public function getName()
    {
        return 'esiee_get_game_data';
    }
} 