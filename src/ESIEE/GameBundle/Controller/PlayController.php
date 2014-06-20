<?php

namespace ESIEE\GameBundle\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class PlayController extends Controller
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @Template
     */
    public function indexAction()
    {
        return array(
            'users' => $this->em->getRepository('ESIEEUserBundle:user')->findAll()
        );
    }
}
