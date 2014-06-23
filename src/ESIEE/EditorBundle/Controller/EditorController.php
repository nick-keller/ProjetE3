<?php

namespace ESIEE\EditorBundle\Controller;

use Doctrine\ORM\EntityManager;
use ESIEE\EditorBundle\Entity\Level;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class EditorController extends Controller
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
            'levels' => $this->em->getRepository('ESIEEEditorBundle:Level')->findByCreator($this->getUser()),
        );
    }

    public function newAction()
    {
        $level = new Level($this->getUser());

        $this->em->persist($level);
        $this->em->flush();

        return $this->redirect($this->generateUrl('esiee_editor_edit', array('id'=>$level->getId())));
    }

    /**
     * @Template
     */
    public function editorAction(Level $level)
    {
        return array(
            'tileFamily' => $this->em->getRepository('ESIEEGameBundle:TileFamily')->findAll(),
            'grounds' => $this->em->getRepository('ESIEEGameBundle:Ground')->findAll(),
            'buildings' => $this->em->getRepository('ESIEEGameBundle:Building')->findAll(),
            'level' => $level,
        );
    }

    public function saveAction(Level $level, Request $request)
    {
        $level->setName($request->request->get('name'));
        $level->setBuildings($request->request->get('buildings'));
        $level->setSize($request->request->get('size'));
        $level->setTiles($request->request->get('tiles'));

        $this->em->persist($level);
        $this->em->flush();

        return new Response('OK');
    }
}
