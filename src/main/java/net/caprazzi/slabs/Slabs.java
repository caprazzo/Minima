package net.caprazzi.slabs;

import net.caprazzi.slabs.SlabsOnKeez.SlabsList;
import net.caprazzi.slabs.SlabsOnKeez.SlabsPut;

public interface Slabs {

	public abstract void list(final SlabsList list);

	public abstract void put(SlabsDoc doc, final SlabsPut callback);

}