<?php

namespace ESIEE\GameBundle\Admin;


use ESIEE\GameBundle\Entity\Tile;
use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class BuildingAdmin extends Admin
{
    protected function configureShowFields(ShowMapper $filter)
    {
        $filter
            ->add('id')
            ->add('name')
            ->add('tile', 'string', array(
                'name' => 'lol',
                'template' => 'ESIEEGameBundle:BuildingAdmin:list_building.html.twig'
            ))
        ;
    }

    // Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('name')
            ->add('coordX', 'buildingselector', array(
                'label' => 'Tuile'
            ))
        ;
    }

    // Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('name')
        ;
    }

    // Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id')
            ->add('name')
            ->add('tile', 'string', array(
                'template' => 'ESIEEGameBundle:BuildingAdmin:list_building.html.twig'
            ))
            ->add('_action', 'actions', array(
                'actions' => array(
                    'show' => array(),
                    'edit' => array(),
                    'delete' => array(),
                )
            ))
        ;
    }
}