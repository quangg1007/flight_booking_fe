import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LegInfo } from 'src/app/models/cardDetail.model';

@Component({
  selector: 'app-card-detail-leg',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card-detail-leg.component.html',
  styleUrl: './card-detail-leg.component.css',
})
export class CardDetailLegComponent {
  @Input() legInfo: LegInfo | undefined;
  @Input() isLoading: boolean = false;
  @Input() headerText: 'Depart' | 'Return' = 'Depart';
  constructor() {}

  ngOnInit() {}

  toggleDetail(index: number) {
    this.legInfo!.isDetailSegmentAmenities[index] =
      !this.legInfo!.isDetailSegmentAmenities[index];
  }
}
