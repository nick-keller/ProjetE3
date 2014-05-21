<?php

namespace ESIEE\GameBundle\Admin;


use ESIEE\GameBundle\Entity\Tile;
use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class TileAdmin extends Admin
{
    protected function configureShowFields(ShowMapper $filter)
    {
        $filter
            ->add('id')
            ->add('tileFamily')
            ->add('type')
            ->add('distribution')
            ->add('tile', 'string', array(
                'name' => 'lol',
                'template' => 'ESIEEGameBundle:TileAdmin:list_tile.html.twig'
            ))
        ;
    }

    // Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('tileFamily', null, array(
                'label' => 'Famille de tuile',
                'empty_value' => false,
            ))
            ->add('coordX', 'tileselector', array(
                'label' => 'Tuile'
            ))
            ->add('type', 'tiletype', array(
                'label' => 'Type',
            ))
            ->add('distribution', 'choice', array(
                'choices' => array(
                    Tile::RANDOM => 'Aléatoire',
                    Tile::CHECKER_TOP_LEFT => 'Haut gauche',
                    Tile::CHECKER_TOP_RIGHT => 'Haut droit',
                    Tile::CHECKER_BOTTOM_LEFT => 'Bas gauche',
                    Tile::CHECKER_BOTTOM_RIGHT => 'Bas droit',
                )
            ))
        ;
    }

    // Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('tileFamily')
            ->add('type')
        ;
    }

    // Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id')
            ->add('tileFamily')
            ->add('tile', 'string', array(
                'template' => 'ESIEEGameBundle:TileAdmin:list_tile.html.twig'
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