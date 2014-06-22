<?php

namespace ESIEE\EditorBundle\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class EditorController extends Controller
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @Template
     */
    public function editorAction()
    {
        return array(
            'tileFamily' => $this->em->getRepository('ESIEEGameBundle:TileFamily')->findAll(),
            'grounds' => $this->em->getRepository('ESIEEGameBundle:Ground')->findAll(),
            'buildings' => $this->em->getRepository('ESIEEGameBundle:Building')->findAll(),
        );
    }
}
