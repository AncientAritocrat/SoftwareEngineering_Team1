from django.db import models


class Subside(models.Model):
    date = models.CharField(db_column='Date', max_length=255, primary_key=True)  # Field name made lowercase.
    nk9_030jkj_1 = models.CharField(db_column='NK9+030JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_035jkj_1 = models.CharField(db_column='NK9+035JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_040jkj_1 = models.CharField(db_column='NK9+040JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_044jkj_6 = models.CharField(db_column='NK9+044JKJ-6', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_045jkj_1 = models.CharField(db_column='NK9+045JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_060jkj_1 = models.CharField(db_column='NK9+060JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_070jkj_1 = models.CharField(db_column='NK9+070JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_085jkj_1 = models.CharField(db_column='NK9+085JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_100jkj_1 = models.CharField(db_column='NK9+100JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_115jkj_1 = models.CharField(db_column='NK9+115JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nk9_130jkj_1 = models.CharField(db_column='NK9+130JKJ-1', max_length=255, blank=True,
                                    null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.

    class Meta:
        managed = False
        db_table = 'Subside'
