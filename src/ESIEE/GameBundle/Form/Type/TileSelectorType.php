<?php
namespace ESIEE\GameBundle\Form\Type;

use ESIEE\GameBundle\Entity\Tile;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class TileSelectorType extends AbstractType
{
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
        ));
    }

    public function getParent()
    {
        return 'text';
    }

    public function getName()
    {
        return 'tileselector';
    }
}