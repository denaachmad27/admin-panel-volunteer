import React, { useState } from 'react';
import { 
  User, 
  Users, 
  DollarSign, 
  Heart,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Banknote,
  Home,
  Truck,
  Briefcase,
  GraduationCap,
  FileText,
  Building,
  Clock,
  Gift,
  Target,
  Award,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Modal from './ui/Modal';
import TabNavigation from './ui/TabNavigation';
import ProfileHeader from './ui/ProfileHeader';
import InfoCard, { InfoItem } from './ui/InfoCard';
import EmptyState from './ui/EmptyState';
import { Button } from './ui/UIComponents';
import volunteerService from '../services/volunteerService';

const VolunteerDetailModal = ({ volunteer, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profil Personal', icon: User, color: 'text-blue-600' },
    { id: 'family', name: 'Data Keluarga', icon: Users, color: 'text-green-600' },
    { id: 'economic', name: 'Data Ekonomi', icon: DollarSign, color: 'text-yellow-600' },
    { id: 'social', name: 'Data Sosial', icon: Heart, color: 'text-purple-600' },
  ];

  const ProfileTab = () => {
    if (!volunteer.profile) {
      return (
        <div className="p-4">
          <EmptyState
            icon={FileText}
            title="Data Profil Belum Lengkap"
            description="Relawan belum mengisi data profil lengkap. Silakan hubungi relawan untuk melengkapi data melalui mobile app."
            variant="warning"
          />
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Identitas Personal */}
          <InfoCard title="Identitas Personal" icon={User} variant="primary">
            <InfoItem label="NIK" value={volunteer.profile.nik} icon={CreditCard} />
            <InfoItem label="Nama Lengkap" value={volunteer.profile.nama_lengkap} icon={User} />
            <InfoItem label="Jenis Kelamin" value={volunteer.profile.jenis_kelamin} icon={User} />
            <InfoItem 
              label="Tempat Lahir" 
              value={volunteer.profile.tempat_lahir} 
              icon={MapPin} 
            />
            <InfoItem 
              label="Tanggal Lahir" 
              value={`${volunteerService.formatDate(volunteer.profile.tanggal_lahir)} (${volunteerService.calculateAge(volunteer.profile.tanggal_lahir)} tahun)`} 
              icon={Calendar} 
            />
            <InfoItem label="Agama" value={volunteer.profile.agama} icon={Heart} />
            <InfoItem label="Status Pernikahan" value={volunteer.profile.status_pernikahan} icon={User} />
          </InfoCard>

          {/* Kontak */}
          <InfoCard title="Kontak" icon={Phone} variant="success">
            <InfoItem label="Email" value={volunteer.email} icon={Mail} />
            <InfoItem label="Telepon" value={volunteer.phone || 'Tidak ada'} icon={Phone} />
          </InfoCard>

          {/* Alamat */}
          <InfoCard title="Alamat Lengkap" icon={MapPin} variant="warning">
            <InfoItem label="Alamat" value={volunteer.profile.alamat} icon={Home} />
            <InfoItem label="Kelurahan" value={volunteer.profile.kelurahan} icon={MapPin} />
            <InfoItem label="Kecamatan" value={volunteer.profile.kecamatan} icon={MapPin} />
            <InfoItem label="Kota" value={volunteer.profile.kota} icon={MapPin} />
            <InfoItem label="Provinsi" value={volunteer.profile.provinsi} icon={MapPin} />
            <InfoItem label="Kode Pos" value={volunteer.profile.kode_pos} icon={MapPin} />
          </InfoCard>

          {/* Pendidikan & Pekerjaan */}
          <InfoCard title="Pendidikan & Pekerjaan" icon={Briefcase} variant="default">
            <InfoItem label="Pendidikan Terakhir" value={volunteer.profile.pendidikan_terakhir} icon={GraduationCap} />
            <InfoItem label="Pekerjaan" value={volunteer.profile.pekerjaan} icon={Briefcase} />
          </InfoCard>
        </div>
      </div>
    );
  };

  const FamilyTab = () => {
    if (!volunteer.families?.length) {
      return (
        <div className="p-4">
          <EmptyState
            icon={Users}
            title="Data Keluarga Belum Ada"
            description="Relawan belum mengisi data keluarga. Silakan hubungi relawan untuk melengkapi data melalui mobile app."
            variant="warning"
          />
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900">Data Keluarga</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 bg-gradient-to-r from-blue-50 to-blue-100 px-2 py-1 rounded-full border border-blue-200">
              {volunteer.families.length} anggota keluarga
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {volunteer.families.map((family) => {
            const getRelationshipVariant = (relation) => {
              if (relation === 'Suami' || relation === 'Istri') return 'primary';
              if (relation === 'Anak') return 'success';
              if (relation === 'Orang Tua') return 'warning';
              return 'default';
            };

            return (
              <InfoCard key={family.id} title={family.nama_anggota} icon={User} variant={getRelationshipVariant(family.hubungan)}>
                <InfoItem label="Hubungan" value={family.hubungan} icon={Users} />
                <InfoItem label="Jenis Kelamin" value={family.jenis_kelamin} icon={User} />
                <InfoItem 
                  label="Usia" 
                  value={`${volunteerService.calculateAge(family.tanggal_lahir)} tahun`} 
                  icon={Calendar} 
                />
                <InfoItem label="Pekerjaan" value={family.pekerjaan} icon={Briefcase} />
                <InfoItem label="Pendidikan" value={family.pendidikan} icon={GraduationCap} />
                <InfoItem 
                  label="Penghasilan" 
                  value={volunteerService.formatCurrency(family.penghasilan)} 
                  icon={DollarSign} 
                />
                <InfoItem label="Tanggungan" value={family.tanggungan ? 'Ya' : 'Tidak'} icon={Users} />
              </InfoCard>
            );
          })}
        </div>
      </div>
    );
  };

  const EconomicTab = () => {
    if (!volunteer.economic) {
      return (
        <div className="p-4">
          <EmptyState
            icon={DollarSign}
            title="Data Ekonomi Belum Ada"
            description="Relawan belum mengisi data ekonomi. Silakan hubungi relawan untuk melengkapi data melalui mobile app."
            variant="warning"
          />
        </div>
      );
    }

    const getStatusVariant = (status) => {
      if (status === 'Surplus') return 'success';
      if (status === 'Seimbang') return 'warning';
      return 'danger';
    };

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900">Data Ekonomi</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            volunteer.economic.status_ekonomi === 'Surplus' ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200' :
            volunteer.economic.status_ekonomi === 'Seimbang' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200' :
            'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200'
          }`}>
            Status: {volunteer.economic.status_ekonomi}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Penghasilan & Pengeluaran */}
          <InfoCard title="Penghasilan & Pengeluaran" icon={Banknote} variant={getStatusVariant(volunteer.economic.status_ekonomi)}>
            <InfoItem 
              label="Penghasilan Bulanan" 
              value={volunteerService.formatCurrency(volunteer.economic.penghasilan_bulanan)} 
              icon={Banknote} 
            />
            <InfoItem 
              label="Pengeluaran Bulanan" 
              value={volunteerService.formatCurrency(volunteer.economic.pengeluaran_bulanan)} 
              icon={DollarSign} 
            />
            <InfoItem 
              label="Sisa Penghasilan" 
              value={volunteerService.formatCurrency(volunteer.economic.sisa_penghasilan)} 
              icon={Banknote} 
            />
            {volunteer.economic.sumber_penghasilan_lain && (
              <InfoItem 
                label="Sumber Penghasilan Lain" 
                value={volunteer.economic.sumber_penghasilan_lain} 
                icon={Briefcase} 
              />
            )}
          </InfoCard>

          {/* Aset & Properti */}
          <InfoCard title="Aset & Properti" icon={Home} variant="primary">
            <InfoItem label="Status Rumah" value={volunteer.economic.status_rumah} icon={Home} />
            <InfoItem label="Jenis Rumah" value={volunteer.economic.jenis_rumah} icon={Home} />
            <InfoItem 
              label="Kendaraan" 
              value={volunteer.economic.punya_kendaraan ? volunteer.economic.jenis_kendaraan : 'Tidak punya kendaraan'} 
              icon={Truck} 
            />
          </InfoCard>

          {/* Tabungan & Hutang */}
          <InfoCard title="Tabungan & Hutang" icon={Banknote} variant="warning">
            <InfoItem 
              label="Tabungan" 
              value={volunteer.economic.punya_tabungan ? volunteerService.formatCurrency(volunteer.economic.jumlah_tabungan) : 'Tidak punya tabungan'} 
              icon={Banknote} 
            />
            <InfoItem 
              label="Hutang" 
              value={volunteer.economic.punya_hutang ? volunteerService.formatCurrency(volunteer.economic.jumlah_hutang) : 'Tidak punya hutang'} 
              icon={DollarSign} 
            />
          </InfoCard>
        </div>
      </div>
    );
  };

  const SocialTab = () => {
    if (!volunteer.social) {
      return (
        <div className="p-4">
          <EmptyState
            icon={Heart}
            title="Data Sosial Belum Ada"
            description="Relawan belum mengisi data sosial. Silakan hubungi relawan untuk melengkapi data melalui mobile app."
            variant="warning"
          />
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900">Data Sosial</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            volunteer.social.aktif_kegiatan_sosial ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200' : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border border-slate-200'
          }`}>
            {volunteer.social.aktif_kegiatan_sosial ? 'Aktif Sosial' : 'Tidak Aktif Sosial'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Organisasi & Kegiatan */}
          <InfoCard title="Organisasi & Kegiatan" icon={Building} variant="primary">
            <InfoItem 
              label="Organisasi" 
              value={volunteer.social.organisasi || 'Tidak bergabung organisasi'} 
              icon={Building} 
            />
            {volunteer.social.jabatan_organisasi && (
              <InfoItem 
                label="Jabatan Organisasi" 
                value={volunteer.social.jabatan_organisasi} 
                icon={Award} 
              />
            )}
            <InfoItem 
              label="Status Kegiatan Sosial" 
              value={volunteer.social.aktif_kegiatan_sosial ? 'Aktif' : 'Tidak aktif'} 
              icon={Heart} 
            />
            {volunteer.social.jenis_kegiatan_sosial && (
              <InfoItem 
                label="Jenis Kegiatan Sosial" 
                value={volunteer.social.jenis_kegiatan_sosial} 
                icon={Heart} 
              />
            )}
          </InfoCard>

          {/* Riwayat Bantuan */}
          <InfoCard title="Riwayat Bantuan" icon={Gift} variant="warning">
            <InfoItem 
              label="Pernah Menerima Bantuan" 
              value={volunteer.social.pernah_dapat_bantuan ? 'Ya' : 'Tidak'} 
              icon={Gift} 
            />
            {volunteer.social.jenis_bantuan_diterima && (
              <InfoItem 
                label="Jenis Bantuan" 
                value={volunteer.social.jenis_bantuan_diterima} 
                icon={Gift} 
              />
            )}
            {volunteer.social.tanggal_bantuan_terakhir && (
              <InfoItem 
                label="Tanggal Bantuan Terakhir" 
                value={volunteerService.formatDate(volunteer.social.tanggal_bantuan_terakhir)} 
                icon={Calendar} 
              />
            )}
          </InfoCard>

          {/* Keahlian & Minat */}
          <InfoCard title="Keahlian & Minat" icon={Target} variant="success">
            <InfoItem 
              label="Keahlian Khusus" 
              value={volunteer.social.keahlian_khusus || 'Tidak ada keahlian khusus'} 
              icon={Award} 
            />
            <InfoItem 
              label="Minat Kegiatan" 
              value={volunteer.social.minat_kegiatan || 'Tidak ada minat khusus'} 
              icon={Target} 
            />
            <InfoItem 
              label="Ketersediaan Waktu" 
              value={volunteer.social.ketersediaan_waktu || 'Tidak ada informasi'} 
              icon={Clock} 
            />
          </InfoCard>
        </div>
      </div>
    );
  };

  // Render tab content function
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'family':
        return <FamilyTab />;
      case 'economic':
        return <EconomicTab />;
      case 'social':
        return <SocialTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Detail Relawan"
      subtitle="Informasi lengkap profil relawan"
      size="5xl"
      className="max-h-[90vh] overflow-hidden"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader 
          volunteer={volunteer}
          showProgress={true}
          size="lg"
        />

        {/* Tab Navigation */}
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          completionData={volunteer.profile_completion?.sections || {}}
        />

        {/* Tab Content */}
        <div className="max-h-96 overflow-y-auto">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 pb-6 px-6 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 font-medium">
              Terdaftar: {volunteerService.formatDate(volunteer.created_at)}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              onClick={onClose}
              className="px-8 py-2.5 font-medium bg-orange-600 hover:bg-orange-700 text-white border-0 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VolunteerDetailModal;